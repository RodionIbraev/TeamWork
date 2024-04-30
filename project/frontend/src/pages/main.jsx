import React from "react";
import logoMain from "../assets/logoMain.svg"
import { UsersThree } from 'phosphor-react';
import '../styles/main.css'
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export const Main = () => {
    return <div className="main">
        <Helmet>
            <title>Главная</title>
        </Helmet>
        <div className="logomain">
            <img src={logoMain} alt="" />
            <p>collaborate, innovate, succeed</p>
        </div>

        <div className="team">
            <UsersThree size={500} />
        </div>

        <div className="info">
        <div className="info1">
            <p>Помогаем повысить продуктивность командной работы, улучшить взаимодействие между сотрудниками и эффективно управлять задачами и проектами.</p>
        </div>

        <div className="btns-log-reg">
            <Link to="/register"><button className="main-btn">Регистрация</button></Link>
            <Link to="/login"><button className="main-btn">Авторизация</button></Link>
        </div>

        <div className="info2">
            <p>TeamWork - это онлайн платформа для эффективной командной работы сотрудников. На сайте менеджеры могут создавать проекты и распределять задачи среди членов команды. Каждый сотрудник может отслеживать свои задачи, их статусы, приоритеты и дедлайны, обеспечивая прозрачность и организованность в рабочем процессе.</p>
        </div>
        </div>
    </div>
}