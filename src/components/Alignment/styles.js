const generateStyle = () => {
  return {
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
    },
    itemSeparator: {borderTop: 'dashed 1px #BBBBBB'},
    outcome: { flex: '0 0 0', padding: '0 0.3rem 0 0' },
    link: { flexGrow: 1, width: '100%' },
    linkText: {
      display: 'table',
      tableLayout: 'fixed',
      whiteSpace: 'nowrap',
      width: '100%'
    },
    innerLinkText: {
      display: 'table-cell',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    delete: { flex: '0 0 1rem' }
  }
}

export default generateStyle
