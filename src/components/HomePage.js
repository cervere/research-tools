import React, {useState, useEffect, createContext, useContext} from 'react';
import { DataContext } from '../context/DataContext.js';
import CollapseButton from './CollapseButton';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import MergeIcon from '@mui/icons-material/Merge';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import RadarIcon from '@mui/icons-material/Radar';
// import { ReactComponent as Logo } from './logo-cropped.svg';
import logoImg from './logo.png';
import {
  Route,
  Link,
  Routes
} from "react-router-dom";
import Table1 from './Table1';
import Dashboard from './Dashboard';
import Figures from './Figures';
import BarChartIcon from '@mui/icons-material/BarChart';
import PrepareData from './PrepareData';
import MergeData from './MergeData';
import DeriveColumns from './utils/DeriveColumns';
import Button from '@mui/material/Button';
import DataViz from './DataViz';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import Consultation from './Consultation';
import { BoxplotViolinMirrorDemo } from './viz/raincloud/BoxplotViolinMirrorDemo';
import { RadarPlotContainer } from './viz/radar/RadarPlotContainer';

const HomePage = () => {
  const { preparedData, setPreparedData, 
    figuresReady, setFiguresReady, 
    statisticsReady, setStatisticsReady,
  showStatistics } = useContext(DataContext);

  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks([
      {
        route: "/articles",
        icon: <AutoStoriesIcon />,
        title: 'Pages',
        active: false
      },
      {
        route: "/prepare",
        icon: <AutoStoriesIcon />,
        title: 'Data Preparation',
        active: true 
      },
      {
        route: "/tables",
        icon: <TableChartIcon />,
        title: 'Table 1',
        active: showStatistics && preparedData 
      },
      {
        route: "/figures",
        icon: <BubbleChartIcon />,
        title: 'Figures',
        active: figuresReady && preparedData 
      }
    ])
  }, [showStatistics, figuresReady, preparedData])

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
              {
                links.filter(({active}) => active).map(({route, icon, title}, i) => (
                <li key={i}>
                <Link to={route}>
                 {icon} 
                  <span>{title}</span>
                </Link>
                </li>
                ))
              }
              <li className="menu-heading">
                <h3>Standalone Tools</h3>
              </li>
              <li key={'radar-tool'}>
                <Link to="/radar">
                  <RadarIcon />
                  <span>Radar Plot</span>
                </Link>
              </li>
              <li key={'rainplot-tool'}>
                <Link to="/rainplot">
                  <WaterDropIcon />
                  <span>RainCloud Plot</span>
                </Link>
              </li>
              <li key={'merge-tool'}>
                <Link to="/merge">
                  <MergeIcon />
                  <span>Merge</span>
                </Link>
                </li>
                {/* <li key={'consult'}>
                <Link to="/consult">
                  <MergeIcon />
                  <span>Consultation</span>
                </Link>
                </li>   */}
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
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://twitter.com/7cervere7" target="_blank">
                  <i className="fab fa-twitter"></i>
                </a>
                <CollapseButton />
              </li>
            </ul>
          </nav>
        </header>
      <section className="page-content">
        <Routes>
          <Route 
          path="/articles"
          element={
            <Dashboard /> 
          }
          />
          <Route 
          path="/prepare"
          element={
            <PrepareData />
          }
          />
          <Route 
          path="/viz"
          element={
            <DataViz 
            setPreparedData={setPreparedData} 
            setFiguresReady={setFiguresReady}  
            setStatisticsReady={setStatisticsReady}
            />
          }
          />
           <Route 
          path="/derive"
          element={
            preparedData ? <DeriveColumns data={preparedData} /> 
            : <Button variant="outlined" color="error">
                            <Link to="/prepare">
                            Please select a dataset
              </Link>
          </Button>
          }
          />
          <Route 
          path="/tables"
          element={
            <Table1 setPreparedData={setPreparedData} setFiguresReady={setFiguresReady}/>
          }
          />
          <Route 
          path="/figures"
          element={
            <Figures preparedData={preparedData} />
          }
          />
          <Route 
          path="/radar"
          element={
            <RadarPlotContainer />
          }
          />
          <Route 
          path="/rainplot"
          element={
            <BoxplotViolinMirrorDemo />
          }
          />
          <Route 
          path="/merge"
          element={
            <MergeData />
          }
          />
          <Route 
          path="/consult"
          element={
            <Consultation />
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



