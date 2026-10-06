import wroclawSkyline from '../../assets/clinic/serhii-pererva-zuZRXeCSJ00-unsplash.jpg'
import styles from './OfficeMap.module.css'

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Rynek+12%2C+Wroc%C5%82aw%2C+Poland'

const OfficeMap = () => (
  <div className={styles.map}>
    <img
      className={styles.photo}
      src={wroclawSkyline}
      alt="Aerial view of Wrocław Old Town near the VitaLog clinic"
    />

    <div className={styles.topFade} aria-hidden="true" />

    <p className={styles.addressBadge}>ul. Rynek 12 · Wrocław</p>

    <div className={styles.officeCard}>
      <span className={styles.marker} aria-hidden="true">
        <span />
      </span>
      <div className={styles.officeDetails}>
        <span>VitaLog Wrocław</span>
        <strong>Rynek 12</strong>
        <small>Old Town · city centre</small>
      </div>
      <a href={MAP_URL} target="_blank" rel="noreferrer">
        Directions
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  </div>
)

export default OfficeMap
