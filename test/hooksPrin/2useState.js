var _state
function useState(initialValue) {
  _state = _state || initialValue // 第一次没有_state时初始化赋值
  function setState(newState) {
    _state = newState
    render()
  }
  return [_state, setState]
}
