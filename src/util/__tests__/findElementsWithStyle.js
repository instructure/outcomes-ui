export const findElementsWithStyle = (wrapper, targetStyles) => {
  return wrapper.findWhere((node) => {
    const style = node.prop('css')

    return (
      style &&
      Object.entries(targetStyles).every(([key, value]) => style[key] === value)
    )
  })
}