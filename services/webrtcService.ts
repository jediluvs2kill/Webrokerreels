
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    onSnapshot,
    collection,
    addDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRxYv5nYoBpIJFL791LNXBn_OUOponrgY",
  authDomain: "webrokerreeelfirebase.firebaseapp.com",
  projectId: "webrokerreeelfirebase",
  storageBucket: "webrokerreeelfirebase.firebasestorage.app",
  messagingSenderId: "858383222991",
  appId: "1:858383222991:web:f8b4e8d835500a7eb4cfba",
  measurementId: "G-NQPJ99T5PN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Use a public STUN server
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;
let onMessageCallback: ((message: string) => void) | null = null;
let onConnectionStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;
let signalingUnsubscribe: (() => void) | null = null;

const sessionsCollectionRef = collection(db, 'sessions');

// --- Main Service Functions ---

export const startSession = async (
    onMessage: (message: string) => void,
    onConnectionStateChange: (state: RTCPeerConnectionState) => void
): Promise<string> => {
    cleanup();
    onMessageCallback = onMessage;
    onConnectionStateChangeCallback = onConnectionStateChange;

    pc = new RTCPeerConnection(servers);
    
    // Create the data channel
    dataChannel = pc.createDataChannel('reactions');
    dataChannel.onmessage = (event) => onMessageCallback && onMessageCallback(event.data);
    
    // Create Firestore signaling document
    const sessionDocRef = await addDoc(sessionsCollectionRef, {});
    const offerCandidatesCollection = collection(sessionDocRef, 'offerCandidates');
    const answerCandidatesCollection = collection(sessionDocRef, 'answerCandidates');
    
    // Listen for ICE candidates and add them to Firestore
    pc.onicecandidate = async (event) => {
        if (event.candidate) {
            await addDoc(offerCandidatesCollection, event.candidate.toJSON());
        }
    };
    
    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
    
    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };
    await setDoc(sessionDocRef, { offer });
    
    // Listen for answer
    signalingUnsubscribe = onSnapshot(sessionDocRef, async (snapshot) => {
        const data = snapshot.data();
        if (!pc?.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            await pc?.setRemoteDescription(answerDescription);
        }
    });

    // Listen for ICE candidates from the other peer
    onSnapshot(answerCandidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc?.addIceCandidate(candidate);
            }
        });
    });

    pc.onconnectionstatechange = () => {
        if(pc) onConnectionStateChangeCallback?.(pc.connectionState);
    };

    return sessionDocRef.id;
};

export const joinSession = async (
    sessionId: string,
    onMessage: (message: string) => void,
    onConnectionStateChange: (state: RTCPeerConnectionState) => void
) => {
    cleanup();
    onMessageCallback = onMessage;
    onConnectionStateChangeCallback = onConnectionStateChange;

    pc = new RTCPeerConnection(servers);
    
    pc.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => onMessageCallback && onMessageCallback(event.data);
    };

    const sessionDocRef = doc(db, 'sessions', sessionId);
    const offerCandidatesCollection = collection(sessionDocRef, 'offerCandidates');
    const answerCandidatesCollection = collection(sessionDocRef, 'answerCandidates');
    
    // Listen for ICE candidates and add them to Firestore
    pc.onicecandidate = async (event) => {
        if (event.candidate) {
            await addDoc(answerCandidatesCollection, event.candidate.toJSON());
        }
    };

    // Get offer from Firestore
    const sessionDoc = await getDoc(sessionDocRef);
    if (!sessionDoc.exists()) throw new Error('Session does not exist');

    const { offer } = sessionDoc.data();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    // Create answer
    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };
    await updateDoc(sessionDocRef, { answer });
    
    // Listen for ICE candidates from the other peer
    signalingUnsubscribe = onSnapshot(offerCandidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc?.addIceCandidate(candidate);
            }
        });
    });
    
    pc.onconnectionstatechange = () => {
        if(pc) onConnectionStateChangeCallback?.(pc.connectionState);
    };
};

export const sendMessage = (message: string) => {
    if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(message);
    } else {
        console.warn('Data channel is not open. Message not sent.');
    }
};

const cleanup = () => {
    if (pc) {
        pc.close();
        pc = null;
    }
    if(signalingUnsubscribe) {
        signalingUnsubscribe();
        signalingUnsubscribe = null;
    }
    dataChannel = null;
    onMessageCallback = null;
    onConnectionStateChangeCallback = null;
};
