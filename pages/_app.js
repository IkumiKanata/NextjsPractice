import Layout from "../components/Layout"
import GlobalStyle from "../styles/globalStyles"



export default function MyApp({ Component, pageProps }) {


  return (
    <>
    <GlobalStyle/>
 <Layout>
  <Component {...pageProps}/>
 </Layout>
    </>
  )
}



