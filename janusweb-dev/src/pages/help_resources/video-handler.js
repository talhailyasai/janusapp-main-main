import React from "react";
import "./style.css";
import Navbar from "./navbar";
import { t } from "i18next";

const VideoHandler = () => {
  const videoSections = [
    {
      title: "Grundläggande användande",
      videos: [
        {
          title: "Video 1",
          description: "[Kort beskrivning av videons innehåll]",
        },
        {
          title: "Video 2",
          description: "[Kort beskrivning av videons innehåll]",
        },
        {
          title: "Video 3",
          description: "[Kort beskrivning av videons innehåll]",
        },
      ],
    },
    {
      title: "Avancerade funktioner",
      videos: [
        {
          title: "Video 1",
          description: "[Kort beskrivning av videons innehåll]",
        },
        {
          title: "Video 2",
          description: "[Kort beskrivning av videons innehåll]",
        },
        {
          title: "Video 3",
          description: "[Kort beskrivning av videons innehåll]",
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ width: "100vw", height: "100vh", background: "white" }}>
        <div className="video-handler">
          <div className="header">Videohandledningar</div>
          {videoSections.map((section, sectionIndex) => (
            <div className="video-section" key={sectionIndex}>
              <div className="video-section-label">{section.title}</div>
              <div className="video-grid">
                {section.videos.map((video, videoIndex) => (
                  <div className="video-card" key={videoIndex}>
                    <div className="video-placeholder"></div>
                    <div className="video-title">{video.title}</div>
                    <div className="video-description">{video.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoHandler;
