import React from 'react'

import classes from './index.module.scss'

const Spinner = () => (
  <div className={classes.spinnerContainer}>
    <div className={classes.loadingSpinner}></div>
  </div>
)

export default Spinner
