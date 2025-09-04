const User = require("../models/user.model");
const Question = require("../models/question.model");


exports.getAllFriends = async (req, res) => {
    const { roomCode } = req.params;
    try {
      const users = await User.find({ 'roomCodes.roomCode': roomCode });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

exports.getFriendDates = async (req, res) => {
    const { roomCode } = req.params;
    let {userId} = req.query;
    // console.log(roomCode);
    // console.log(userId);
  
    if( !userId ) {
      userId = req.user.userId;
    }
    try {
      const dates = await Question.aggregate([
        { $match: { userId: userId, roomCode: roomCode } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
        },
        { $sort: { "_id": 1 } },
      ]);
  
      // Format dates to Indian Standard Time (IST) without using libraries
      const formattedDates = dates.map(dateObj => {
        const utcDate = new Date(dateObj._id);
        const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours for IST
        const formattedDate = istDate.toISOString().split('T')[0];
        return formattedDate;
      });
  
      console.log(formattedDates);
      res.status(200).json({ success: true, data: formattedDates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

exports.getAllQuestions = async (req, res) => {
    const { roomCode } = req.params;
    let { userId, date } = req.query;
    try {
      if( !userId ) {
        userId = req.user.userId;
      }
      let query = { userId: userId, roomCode: roomCode };
  
      if (date) {
        // If date is provided, convert it from IST to UTC and create a date range for the entire day in UTC
        const startOfDayIST = new Date(date);
        const endOfDayIST = new Date(startOfDayIST);
      
        // Convert to UTC (subtract 5 hours and 30 minutes)
        startOfDayIST.setUTCHours(0, 0, 0, 0);
        endOfDayIST.setUTCHours(23, 59, 59, 999);
      
        // Query date range in UTC
        const startOfDayUTC = startOfDayIST.toISOString();
        const endOfDayUTC = endOfDayIST.toISOString();
      
        query.date = { $gte: startOfDayUTC, $lte: endOfDayUTC };
      }
      const questions = await Question.find(query);
  
      if (questions.length > 0) {
        res.status(200).json({ success: true, data: questions });
      } else {
        res.status(404).json({ success: false, error: 'No questions found for this user, room, and date' });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}