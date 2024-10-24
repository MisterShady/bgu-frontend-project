import React from "react";
import LazyLoad from 'react-lazyload';
import "./AboutUs.css";

interface TeamMember {
  image: string;
  role: string;
  gitlabIssues: string;
}

const teamMembers: TeamMember[] = [
  { image: "https://avatars.githubusercontent.com/u/124059586?v=4", role: "Аналитик: Ковалев А.Л.", gitlabIssues: "https://github.com/sereraguy" },
  { image: "https://avatars.githubusercontent.com/u/81161586?v=4", role: "Бэкендер: Головков И.Е.", gitlabIssues: "https://github.com/iggosha" },
  { image: "https://avatars.githubusercontent.com/u/124059455?v=4", role: "Фронтендер: Виноходов Д.А.", gitlabIssues: "https://github.com/Vawlik" },
  { image: "https://avatars.githubusercontent.com/u/121055448?v=4", role: "Фронтендер: Еременко В.А.", gitlabIssues: "https://github.com/MisterShady" },
];

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>О нас</h1>
      <p>Мы рады приветствовать вас на нашем сайте, где вы можете приобрести продукцию компании Apple. Наш ассортимент включает в себя новейшие модели iPhone, iPad, MacBook, Apple Watch и множество других устройств и аксессуаров. Мы стремимся предоставить вам лучший выбор и качество, чтобы вы могли наслаждаться технологиями Apple в полной мере.</p>
      <p>Наша команда состоит из профессионалов, которые готовы помочь вам с выбором и консультацией по любым вопросам. Мы ценим каждого клиента и стремимся сделать ваш опыт покупок максимально комфортным и приятным.</p>

      <div className="links">
        <a href="https://github.com/MisterShady/bgu-frontend-project/" target="_blank" rel="noopener noreferrer" className="link">Проект на GitHub</a>
        <a href="https://gitlab.com/newtonshoppers/newtonshop" target="_blank" rel="noopener noreferrer" className="link">Проект на GitLab</a>
      </div>

      <h2>Наши сотрудники</h2>
      <div className="team">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <LazyLoad height={200} offset={100}>
              <img src={member.image} alt={member.role} />
            </LazyLoad>
            <p>{member.role}</p>
            <a href={member.gitlabIssues} target="_blank" rel="noopener noreferrer" className="link" style={{ textDecoration: "none" }}>GitHub </a>
          </div>
        ))}
      </div>

      <h2>Наш офис</h2>
      <div className="map-container">
        <iframe
          className="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d753.008463509618!2d36.57666312136791!3d50.593513123057924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41266a8ad545d339%3A0x102f5211627fc3fb!2z0YPQuy4g0J_QvtCx0LXQtNGLLCA4NSwg0JHQtdC70LPQvtGA0L7QtCwg0JHQtdC70LPQvtGA0L7QtNGB0LrQsNGPINC-0LHQuy4sIDMwODAxNQ!5e0!3m2!1sru!2sru!4v1729603892976!5m2!1sru!2sru"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default AboutUs;
