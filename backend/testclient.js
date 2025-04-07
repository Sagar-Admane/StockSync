import io from "socket.io-client";

const socket = io("http://localhost:5001");

socket.on("connect", ()=>{
    console.log("connected to server .... ");
    console.log("Emitting subscribe stock");
    socket.emit("subscribeStock", "IBM");
})

socket.on("stockUpdate", (data) => {
    console.log("Stock Update:", data);
});

socket.on("disconnect", ()=>{
    console.log("Disconnected from server");
})