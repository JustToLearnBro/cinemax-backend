import Screening from "../models/screeningmodel.js"

export const addScreening = async (req, res) => {
    const { imdbID, screeningDate } = req.body;

    // Validation
    if (!imdbID || !screeningDate) {
        return res.status(400).json({ msg: 'Please provide both IMDb ID and Screening Date' });
    }

    try {
      let screeningDateObject = new Date(screeningDate);

    // Set the time to 6 PM (18:00)
    screeningDateObject.setHours(18, 0, 0, 0);

    // Create the new screening with the adjusted date
    const newScreening = new Screening({
        imdbID,
        screeningDate: screeningDateObject,
    });

        await newScreening.save();

        res.status(201).json({ msg: 'Screening added successfully', screening: newScreening });
    } catch (error) {
        // console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}


export const upcomingScreening = async (req, res) => {
    try {
        
        const currentDate = new Date();
        // currentDate.setHours(18, 0, 0, 0); // Set the time to 6 PM (18:00)

        const screenings = await Screening.find({
          screeningDate: { $gte: currentDate }
        });
    
        res.json(screenings);
      } catch (error) {
        // console.error(error);
        res.status(500).json({ msg: 'Server error' });
      }
}

export const pastScreening = async (req, res) => {
    try {
        
        const currentDate = new Date();
        // currentDate.setHours(18, 0, 0, 0); // Set the time to 6 PM (18:00)

        const screenings = await Screening.find({
          screeningDate: { $lt: currentDate }
        });
    
        res.json(screenings);
      } catch (error) {
        // console.error(error);
        res.status(500).json({ msg: 'Server error' });
      }
}

export const isScreened = async (req, res) => {
  
  const {imdbId}=req.body
  // console.log(imdbId)
  try {
      
      const currentDate = new Date();
  
      const screenings = await Screening.find({
        imdbID:imdbId
      });
      // console.log("Screening ",screenings)
      // console.log("screen",screenings[0].screeningDate)
      // console.log("cureent",currentDate)

      if(currentDate>screenings[0].screeningDate)
      {
        res.json({isScreened:true,screeningDate:screenings[0].screeningDate});
      }
      else{
        res.json({isScreened:false,screeningDate:screenings[0].screeningDate});
      }
  
      
    } catch (error) {
      // console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
}

export const movieDetails = async (req, res) => {
  
  const {imdbId}=req.body
  // console.log(imdbId,req.body)

  try {
      
      // const currentDate = new Date();
  
      const screenings = await Screening.find({
        imdbID:imdbId
      });
      // console.log("screening",screenings)
      res.json({data:screenings});

    } catch (error) {
      // console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
}




