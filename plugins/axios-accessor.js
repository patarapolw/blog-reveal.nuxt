import { initializeAxios } from '../utils/api'

const accessor = ({ $axios }) => {
  initializeAxios($axios)
}

export default accessor