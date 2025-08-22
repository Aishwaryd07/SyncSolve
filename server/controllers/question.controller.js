const Question = require('../models/question.model')


exports.addQuestion = async (req, res) => {
    const roomCode = req.params.roomCode;
    const user = req.user;
    if (req.file) {
      console.log(user.userId);
      const imageSolution = req.file;
      const all = Object.keys(req.body).map(key => req.body[key]);
      const options = all[1];
      const question = req.body.question;
  
      try {
  
        const newQuestion = new Question({
          userId : user.userId,
          roomCode : roomCode,
          question,
          options: options,
          imageSolution,
        });
  
        await newQuestion.save();
  
        res.json({ message: 'Question created successfully', QuestionId: newQuestion.id });
      } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      // If imageSolution is not provided
      console.log(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      const all = Object.keys(req.body).map(key => req.body[key]);
      const options = all[1];
      const question = req.body.question;
  
      try {
        const newQuestion = new Question({
          userId : user.userId,  
          roomCode : roomCode,
          question,
          options: options,
        });
  
        await newQuestion.save();
  
        res.json({ message: 'Question created successfully', QuestionId: newQuestion.id });
      } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}

exports.getAllQuestions = async (req, res) => {
  const { date } = req.query;
  const { roomCode } = req.params;
  try {
    let query = { roomCode };

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
      res.status(404).json({ success: false, error: 'No questions found for this date and room code' });
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.getAllDates = async (req, res) => {
  const roomCode = req.params.roomCode;

  try {
    const dates = await Question.aggregate([
      { $match: { roomCode } }, // Match documents with the specified room code and user ID
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

    res.status(200).json({ success: true, data: formattedDates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

exports.deleteQuestion = async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const result = await Question.findByIdAndDelete(questionId);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}