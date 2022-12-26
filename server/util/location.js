const API_KEY = 'AIzaSyCD_L-MKLwKGhxgVONXP9vHMBXLQyGGXLI';
import axios from 'axios';
import HttpError from '../models/httpError.js';

const getCoordsForAddress = async () => {
  // const response = await axios.get(
  //   'https://api.ipbase.com/v2/info?apikey=TLLL7GSfXIbaK0ElLUTP2YDQXYIH8BCM6CBUAY7P'
  // );

  // const { data } = response;
  // const { data: _data } = data;
  // const { location } = _data;

  // const coordinates = {
  //   lat: location.lat,
  //   lng: location.lng,
  // };

  // return coordinates;
  return {
    lat: -17.822332,
    lng: 31.0558171,
  };

  // const response = await axios.get(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&key=${API_KEY}`
  // );

  // console.log(response);

  // const { data } = response;

  // if (!data || data.status === 'ZERO_RESULTS') {
  //   throw new HttpError('Could not find this location', 404);
  // }

  // const { location: coordinates } = data.geometry;
  // return coordinates;
};

export default getCoordsForAddress;
