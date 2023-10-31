const generateStyle = () => {
  return {
    outcomeTray: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: '0',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0'
    },
    trayContainer: {
      padding: '1rem',
      flexGrow: 1,
      overflow: 'auto',
      minHeight: '0'
    },
    footerContainer: { bottom: '0', position: 'sticky' }
  }
}

export default generateStyle
