const disconnect = (reason: string, livestreamId: string, userId: string) => {
  console.log(
    `User ${userId} disconnected as listener from livestream ${livestreamId} due to ${reason}`
  );
};

export default {
  disconnect,
};
