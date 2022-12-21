import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import { listTopProducts } from '../actions/productActions'

const PrivacyPolicy = () => {
    
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  return (
    <div>
        <h1>Privacy Policy</h1>
        <p style={{ fontSize: '1rem' }}>
        This privacy policy has been compiled to better serve those who are concerned with how their ‘Personally Identifiable Information’ (PII) is being used online. PII is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.
<br />
<br />
What personal information do we collect from the people that visit our blog, website or app?
<br />
When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number or other details to help you with your experience.
<br />
<br />
When do we collect information?
<br />
We collect information from you when you register on our site, place an order, subscribe to a newsletter, fill out a form or enter information on our site.
<br />
<br />
How do we use your information?
<br />
We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
<br />
- To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.
<br />
- To allow us to better service you in responding to your customer service requests.
<br />
- To administer a contest, promotion, survey or other site feature.
<br />
- To quickly process your transactions.
<br />
- To ask for ratings and reviews of services or products
<br />
- To follow up with them after correspondence (live chat, email or phone inquiries)
<br />
<br />
How do we protect your information?
<br />
We do not use vulnerability scanning and/or scanning to PCI standards.
<br />
An external PCI compliant payment gateway handles all CC transactions.
<br />
We use regular Malware Scanning.
<br />
Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
<br />
<br />
We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information.
<br />
<br />
All transactions are processed through a gateway provider and are not stored or processed on our servers.
<br />
<br />
Do we use ‘cookies’?
<br />
Yes. Cookies are small files that a site or its service provider transfers to your computer’s hard drive through your Web browser (if you allow) that enables the site’s or service provider’s systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
<br />
We use cookies to:
<br />
<br />
- Help remember and process the items in the shopping cart.
<br />
- Keep track of advertisements.
<br />
- Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf.
<br />
- You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser’s Help Menu to learn the correct way to modify your cookies.
<br />
<br />
If you turn cookies off, Some of the features that make your site experience more efficient may not function properly.It won’t affect the user’s experience that make your site experience more efficient and may not function properly.
<br />
<br />
Third-party disclosure
<br />
We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it’s release is appropriate to comply with the law, enforce our site policies, or protect ours or others’ rights, property or safety.
<br />
<br />
However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
<br />
<br />
Third-party links
<br />
We do not include or offer third-party products or services on our website.
<br />
<br />
Does our site allow third-party behavioral tracking?
<br />
<br />
It’s also important to note that we do not allow third-party behavioral tracking.
        </p>

<h1 className='mt-4 text-center'>Top Products</h1>
    <Row>
        {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}</Row>
    </div>
  )
}

export default PrivacyPolicy