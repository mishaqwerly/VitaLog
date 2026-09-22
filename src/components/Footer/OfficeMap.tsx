import styles from './OfficeMap.module.css'

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Rynek+12%2C+Wroc%C5%82aw%2C+Poland'
const MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=17.0200%2C51.1030%2C17.0440%2C51.1150&layer=mapnik&marker=51.1092%2C17.0321'

const OfficeMap = () => (
  <div className={styles.map}>
    <iframe
      className={styles.mapFrame}
      src={MAP_EMBED_URL}
      title="Map showing the VitaLog office in Wrocław"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />

    <div className={styles.topFade} aria-hidden="true" />

    <div className={styles.coordinates} aria-hidden="true">
      51.1092° N · 17.0321° E
    </div>

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
