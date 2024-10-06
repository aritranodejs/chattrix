export const emitEventToRoom = (io, room, eventName, data) => {
    io.to(room).emit(eventName, data); // Emit the event to a specific room
};

export const emitEventToAll = (io, eventName, data) => {
    io.emit(eventName, data); // Emit the event to all connected clients
};