import '../styles/AboutPage.css';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="about-container">
      <section className="about-hero-section">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Streamline Your Requests with RequestHub</h1>
          <p className="about-hero-subtitle">
            The all-in-one platform for managing ID cards, leaves, hackathons, internships, and more.
          </p>
          <button className="about-cta-button" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </section>

      <section className="about-features-section">
        <h2 className="about-section-title">Why Choose RequestHub?</h2>
        <div className="about-features-grid">
          <div className="about-feature-card">
            <div className="about-feature-icon">📝</div>
            <h3 className="about-feature-title">Easy Request Submission</h3>
            <p className="about-feature-description">Submit requests for ID cards, leaves, hackathons, internships, and more with just a few clicks.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-feature-icon">📊</div>
            <h3 className="about-feature-title">Real-time Status Tracking</h3>
            <p className="about-feature-description">Monitor your forms with clear indicators for approved, rejected, or pending statuses.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-feature-icon">🔔</div>
            <h3 className="about-feature-title">Instant Email Updates</h3>
            <p className="about-feature-description">Get notified immediately when there's an update to your request status.</p>
          </div>
        </div>
      </section>

      <section className="about-how-it-works">
        <h2 className="about-section-title">How RequestHub Works</h2>
        <div className="about-steps-container">
          <div className="about-step">
            <div className="about-step-number">1</div>
            <div className="about-step-content">
              <h3 className="about-step-title">Submit Your Request</h3>
              <p className="about-step-description">Fill out the simple form for what you need - whether it's an ID card, leave application, or hackathon registration.</p>
            </div>
          </div>
          <div className="about-step">
            <div className="about-step-number">2</div>
            <div className="about-step-content">
              <h3 className="about-step-title">Track Progress</h3>
              <p className="about-step-description">Watch your request move through the approval process with our clear status indicators.</p>
            </div>
          </div>
          <div className="about-step">
            <div className="about-step-number">3</div>
            <div className="about-step-content">
              <h3 className="about-step-title">Get Notified</h3>
              <p className="about-step-description">Receive email updates when your request is approved, rejected, or needs additional information.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <h2 className="about-cta-title">Ready to Simplify Your Request Process?</h2>
        <p className="about-cta-subtitle">Join thousands of users who have streamlined their request workflows with RequestHub.</p>
        <button className="about-cta-button" onClick={() => navigate('/login')}>Start Using RequestHub Today</button>
      </section>
    </div>
  );
};

export default AboutPage;