module.exports = {
    emitEvent: (io, eventName, data) => {
        io.emit(eventName, data);
    },

    emitRestaurantEvent: (io, restaurantId, eventName, data) => {
        if (io && restaurantId) {
            // Emit the event only to the room for the restaurant
            io.to(`restaurant_${restaurantId}`).emit(eventName, data);
            console.log(`Emitted event ${eventName} to restaurant_${restaurantId}`);
        } else {
            console.error('Invalid restaurantId or io instance');
        }
    }
};