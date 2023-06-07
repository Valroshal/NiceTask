import {Request, Response} from "express";
import axios from 'axios';

const getWeather = async (req: Request, res: Response) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).send('Not enough data to send you weather info');
    }

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&relativehumidity_2m,windspeed_10m`;
    const response = await axios.get(apiUrl);

    return res.status(201).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export { getWeather };
