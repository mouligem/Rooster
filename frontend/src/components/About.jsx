// export default About;
import React from 'react';
import './About.css'; 
import old from '../assets/old.jpg';
import a from '../assets/amb.jfif';
import cat from '../assets/cat.jfif';
import ser from '../assets/ser.jfif';
function About() {
  const videoSrc = "assets/vid.mp4"; 

  const sections = [
    { title: "Kudil", content: "We, The Kudlil, is a traditional multi-cuisine restaurant, specialized in Kongu Cuisine, offering authentic, healthy, and yummy food. Taste our traditional specialities made with homemade spices & masalas, cold pressed oils, and cow ghee from native farms. The quality of our food and the ambience will make you feel at home or native. Relish the savour of our traditional Kongu varieties..", imageUrl: old },
    { title: "Catering", content: "Our catering service is designed to bring the exceptional flavors of our restaurant directly to your special events. From intimate gatherings to grand celebrations, we offer a diverse menu that caters to all tastes and preferences. Our team meticulously prepares each dish using the freshest ingredients, ensuring the same high standards of quality and authenticity that you experience in our restaurant. Whether you’re hosting a wedding, corporate event, or family reunion, our catering service provides a seamless experience with exquisite food and attentive service.", imageUrl: cat },
    { title: "Ambience", content: "At Kudil, we believe that dining is more than just a meal—it's an experience. Our restaurant boasts a warm and inviting atmosphere that perfectly complements our traditional Kongu cuisine. Step into an environment where rustic charm meets modern comfort, with carefully curated decor that reflects the rich heritage of our culinary roots. Soft lighting, comfortable seating, and an elegant yet cozy ambiance create a welcoming space for family gatherings, romantic dinners, and casual get-togethers alike. Our attentive staff is dedicated to providing exceptional service.", imageUrl: a },
    { title: "Services", content: "At Kudil, exceptional service is at the heart of our dining experience. Our dedicated team of professionals is committed to providing personalized and attentive service from the moment you walk through our doors. Each staff member is trained to ensure that every guest feels welcomed and valued, delivering a seamless experience with genuine warmth and expertise. We take pride in our ability to anticipate and meet your needs, whether it's offering menu recommendations, accommodating special requests, or ensuring that your dining experience is flawless.", imageUrl: ser }
  ];

  return (
    // <div className='bg'>
    <div className="about-container">
      {/* Background video */}
      
      {sections.map((section, index) => (
        <div key={index} className={`content ${index % 2 === 0 ? 'left-image' : 'right-image'}`}>
          <section className="sections">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </section>
          <div className="photo">
            <img src={section.imageUrl} alt={section.title} width={150} height={220} />
          </div>
        </div>
      ))}
    </div>
    // </div>
  );
}

export default About;

