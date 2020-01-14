const convertToPoints = (percent, scoringMethod) => {
  if (scoringMethod) {
    return parseFloat((scoringMethod.points_possible * percent).toFixed(2))
  } else {
    return void 0
  }
}

export default convertToPoints
