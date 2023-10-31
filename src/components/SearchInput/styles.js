const generateStyle = () => {
  return {
    search: {
      'input[type=search]::-ms-clear': {
        display: 'none',
        width: '0',
        height: '0'
      },
      'input[type=search]::-ms-reveal': {
        display: 'none',
        width: '0',
        height: '0'
      },
      "input[type='search']::-webkit-search-decoration": {
        display: 'none'
      },
      "input[type='search']::-webkit-search-cancel-button": {
        display: 'none'
      },
      "input[type='search']::-webkit-search-results-button": {
        display: 'none'
      },
      "input[type='search']::-webkit-search-results-decoration": {
        display: 'none'
      }
    }
  }
}
export default generateStyle
