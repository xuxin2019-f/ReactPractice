import Redirect from 'umi/redirect'
import router from 'umi/router'
export default props => {
  if(new Date().getDay() % 2 === 0) {
  return <Redirect to='/login'/>
  }
    return (
      <div>
        PrivateRoute
        {props.children}
      </div>
    )
}
