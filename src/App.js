import { useEffect, useState, useCallback } from "react";
import { api } from "./services/api";
import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

function App() {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [timeZone, setTimeZone] = useState('America/New_York');
  const [availability, setAvailability] = useState(null);
  
  const loadAvailabilities = useCallback(() => {
    api.get('/').then(res => {
      setAvailability(res.data);
    })
  }, []);

  useEffect(() => {
    loadAvailabilities()
  }, [loadAvailabilities])

  const getDateTime = (timeZone, time) => {
    const [ hour, minutes ] = time.split(':');

    console.log(hour, minutes);

    return dayjs.utc()
      .set('hour', hour)
      .set('minute', minutes)
      .format()
  }

  const updateAvailability = async () => {
    try {
      console.log({ timeZone, startTime, endTime })

      const startDateTime = getDateTime(timeZone, startTime);
      const endDateTime = getDateTime(timeZone, endTime);
      
      console.log({ startDateTime, endDateTime })
      
      await api.post('/', {
        startTime: startDateTime,
        endTime: endDateTime,
        timeZone,
      })

      loadAvailabilities()
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>Availability Test</h1>
      
      <input type="text" placeholder="Timezone" value={timeZone} onChange={e => setTimeZone(e.target.value)}/>
      <input value={startTime} onChange={e => setStartTime(e.target.value)} type="time" />
      <input value={endTime} onChange={e => setEndTime(e.target.value)} type="time" />

      <button onClick={updateAvailability}>Enviar</button>

      <br />

      {availability?.startTime} - {availability?.endTime} <br />
      {availability?.startTimeUtc} - {availability?.endTimeUtc}
    </>
  );
}

export default App;
