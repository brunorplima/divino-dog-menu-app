import axios from "axios"

export const getServerDate = async () => {
   const { data } = await axios.get('/api/current_date_time')
   return new Date(data.date)
}
