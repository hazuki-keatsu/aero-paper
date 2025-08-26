import satori from "satori";
// import { html } from "satori-html";
import { SITE } from "@/config";
import loadYozaiFont from "../loadYozaiFont";
import { getThemeColors } from "../extractCssVariables";

// 获取主题色
const themeColors = getThemeColors();

// 定义渐变色
const gradientColors = {
  primary: `linear-gradient(135deg, ${themeColors.highlightText}, ${themeColors.secondaryHighlight})`,
  backgroundDecoration: `linear-gradient(135deg, rgba(0, 108, 172, 0.1) 0%, rgba(255, 107, 1, 0.1) 100%)`,
  alternativeBackgroundDecoration: `linear-gradient(135deg, rgba(255, 107, 1, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)`,
};

export default async post => {
  const fonts = await loadYozaiFont();
  
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "linear-gradient(135deg, #fdfdfd 0%, #e6f7ff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-50px",
                left: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: gradientColors.backgroundDecoration,
                filter: "blur(40px)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-80px",
                right: "-30px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: gradientColors.alternativeBackgroundDecoration,
                filter: "blur(40px)",
              },
            },
          },
          // 半透明主容器
          {
            type: "div",
            props: {
              style: {
                position: "relative",
                width: "90%",
                height: "85%",
                backgroundColor: "rgba(253, 251, 251, 0.7)", // 半透明背景
                backdropFilter: "blur(10px)", // 毛玻璃效果
                borderRadius: "16px",
                border: "1px solid rgba(236, 233, 233, 0.5)",
                boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "40px",
                zIndex: 10,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    },
                    children: [
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 64,
                            fontWeight: "bold",
                            maxHeight: "70%",
                            overflow: "hidden",
                            fontFamily: "Yozai",
                            color: themeColors.foreground,
                            lineHeight: 1.3,
                          },
                          children: post.data.title,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "80px",
                            height: "4px",
                            background: gradientColors.primary,
                            borderRadius: "2px",
                          },
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: {
                            fontSize: 24,
                            fontWeight: "normal",
                            maxHeight: "70%",
                            overflow: "hidden",
                            fontFamily: "Yozai",
                            color: themeColors.foreground,
                            lineHeight: 1.3,
                          },
                          children: post.data.description,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginBottom: "8px",
                      fontSize: 28,
                      fontFamily: "Yozai",
                      color: themeColors.foreground,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: {
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  background: gradientColors.primary,
                                },
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: {
                                  fontWeight: "bold",
                                },
                                children: post.data.author,
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontWeight: "bold",
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  background: gradientColors.primary,
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                },
                                children: new URL(SITE.website).hostname,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: fonts,
    }
  );
};