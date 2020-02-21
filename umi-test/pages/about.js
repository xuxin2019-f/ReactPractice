/**
 * title: AboutPage
 * Routes:
 * - ./routes/PrivateRoute.js
*/

// 上面的注释符合yaml语法，title是一个字符串，Routes是一个数组
import styles from './about.css';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page about</h1>
    </div>
  );
}
