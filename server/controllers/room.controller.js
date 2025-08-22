const Room = require('../models/room.model');  
const User = require('../models/user.model'); 

exports.createRoom = async (req, res) => {
    try {
      const { groupName } = req.body;
      const generatedCode = Math.random().toString(36).substr(2, 7);
  
      // Create a new room object with groupName and generatedCode
      const newRoom = new Room({
        groupName: groupName,
        roomCode: generatedCode
      });
  
      // Save the new room to the database
      const savedRoom = await newRoom.save();
  
      const userId = req.user.userId;
  
      // Update the user's document to push the roomCode and groupName
      await User.findByIdAndUpdate(userId, {
        $push: {
          roomCodes: {
            roomCode: generatedCode,
            groupName: groupName
          }
        }
      });
  
      res.status(201).json({ message: 'Room created successfully', room: savedRoom });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create room', message: error.message });
    }
}

// exports.ifRoomExists = async (req, res) => {
//     try {
//       // Get the user ID from the authenticated request
//       const userId = req.user.userId;
  
//       // Find the user document based on the user ID
//       const user = await User.findById(userId);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Extract room codes and group names from the user document
//       const roomData = user.roomCodes.map(room => ({
//         roomCode: room.roomCode,
//         groupName: room.groupName
//       }));
  
//       // Send room codes and group names in the response
//       res.json({ roomData });
//     } catch (error) {
//       console.error('Error fetching room data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
// }

exports.ifRoomExists = async (req, res) => {
  const roomCode = req.params.roomCode;
  const userId = req.user.userId;

  try {
    const room = await Room.findOne({ roomCode });

    if (room) {
      const user = await User.findById(userId);

      if (user.roomCodes.some(code => code.roomCode === roomCode)) {
        // If the room code already exists for the user, send a message
        res.status(400).json({ exists: true, message: 'Room already added' });
      } else {
        // If the room code doesn't exist for the user, add it
        await User.findByIdAndUpdate(userId, {
          $push: {
            roomCodes: {
              roomCode: room.roomCode,
              groupName: room.groupName
            }
          }
        });
        res.status(200).json({ exists: true, room });
      }
    } else {
      res.status(404).json({ exists: false, message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getRooms = async (req, res) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user.userId;

    // Find the user document based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract room codes and group names from the user document
    const roomData = user.roomCodes.map(room => ({
      roomCode: room.roomCode,
      groupName: room.groupName
    }));

    // Send room codes and group names in the response
    res.json({ roomData });
  } catch (error) {
    console.error('Error fetching room data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
