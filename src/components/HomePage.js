import React, {useState, useEffect} from 'react';
import CollapseButton from './CollapseButton';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
// import { ReactComponent as Logo } from './logo-cropped.svg';
import logoImg from './logo.png';
import {
  Route,
  Link,
  Routes
} from "react-router-dom";
import Table1 from './Table1';
import Dashboard from './Dashboard';



const HomePage = () => {
    return (
      <div>
        <svg style={{display:"none"}}>
          <symbol id="down" viewBox="0 0 16 16">
            <polygon points="3.81 4.38 8 8.57 12.19 4.38 13.71 5.91 8 11.62 2.29 5.91 3.81 4.38" />
          </symbol>
        </svg>
        <header className="page-header">
          <nav>
            {/* <a href="#0" aria-label="forecastr logo" className="logo"> */}
              {/* <svg> */}
                {/* <Logo /> */}
                <img src={logoImg} alt="Logo" />
              {/* </svg> */}
            {/* </a> */}
            <button className="toggle-mob-menu" aria-expanded="false" aria-label="open menu">
              <svg width="20" height="20" aria-hidden="true">
                <use xlinkHref="#down"></use>
              </svg>
            </button>
            <ul className="admin-menu">
              <li className="menu-heading">
                <h3>Admin</h3>
              </li>
              {/* <li>
              <Link to="/articles">
                <AutoStoriesIcon />
                <span>Pages</span>
              </Link>
              </li> */}
              <li>
              <Link to="/tables">
                <AutoStoriesIcon />
                <span>Table 1</span>
              </Link>
              </li>
              <li>
                <div className="switch" style={{display: 'none'}}>
                  <input type="checkbox" id="mode" defaultChecked />
                  <label htmlFor="mode">
                    <span></span>
                    <span>Dark</span>
                  </label>
                </div>
                <span>made by </span>
                <a href="https://github.com/cervere" target="_blank">
                  <i class="fab fa-github"></i>
                </a>
                <a href="https://twitter.com/7cervere7" target="_blank">
                  <i class="fab fa-twitter"></i>
                </a>
                <CollapseButton />
              </li>
            </ul>
          </nav>
        </header>
      <section className="page-content">
        {/* <section className="search-and-user">
          <form>
            <input type="search" placeholder="Search Pages..." />
            <button type="submit" aria-label="submit form">
              <svg aria-hidden="true">
              <SearchIcon />
              </svg>
            </button>
          </form>
          <div className="admin-profile">
            <span className="greeting">Hello admin</span>
            <div className="notifications">
              <span className="badge">1</span>
              <AccountCircleIcon />
            </div>
          </div>
        </section> */}
        <Routes>
          <Route 
          path="/articles"
          element={
            <Dashboard /> 
          }
          />
          <Route 
          path="/tables"
          element={
            <Table1 />
          }
          />
        </Routes>


  {/* For later...
  <DocxReader />
    */} 
        <footer className="page-footer">
        </footer>
      </section>
    </div>
    );
  };
  
export default HomePage;