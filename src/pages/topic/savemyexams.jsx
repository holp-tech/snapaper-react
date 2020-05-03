import React from "react";
import dynamic from "next/dynamic";

//动态引入组件
const Header = dynamic(() => import("../../components/header"));
const Footer = dynamic(() => import("../../components/footer"));

// 引入 AntD 资源
import { notification, Skeleton, Button, Empty } from "antd";
import { ArrowLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

// 引入 axios 进行 HTTP 请求
import { Get } from "react-axios";

// 引入 jQuery 进行下载创建
import $ from "jquery";

// 配置提示触发函数
const openNotificationWithIcon = (type, content) => {
  notification[type]({
    message: "Notification",
    description: content,
  });
};

// 文件下载创建函数
function downloadFile(srcUrl) {
  var $a = $("<a/>")
    .attr("href", "https://pokers.zeo.im/download?filename=" + srcUrl)
    .attr("download", "");
  $a[0].click();
}

export default class sme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      MBSvisible: false,
      subjectCount: 0,
    };
  }
  render() {
    return (
      <div>
        <Header></Header>
        <main className="ant-container">
          <section className="next-cate-header next-topic-header">
            <div className="left">
              <div>
                <h1>Save My Exams</h1>
                <p>
                  Cambridge International General Certificate of Education
                  Advanced Level
                </p>
              </div>
            </div>
            <div className="next-cate-header-info topic-header">
              <div>
                <Button>
                  {this.state.display
                    ? this.state.subjectCount + " Items"
                    : "Unknown"}
                </Button>
                <Button type="primary" onClick={() => history.go(-1)}>
                  <ArrowLeftOutlined /> Back
                </Button>
              </div>
            </div>
          </section>
          <section>
            <div className="next-cate-subject savemyexams">
              <div
                onClick={() =>
                  this.setState({ subject: "biology", subjectDisplay: true })
                }
              >
                <h2>Biology</h2>
                <p>
                  Click to load <CaretRightOutlined />
                </p>
              </div>
              <div
                onClick={() =>
                  this.setState({ subject: "physics", subjectDisplay: true })
                }
              >
                <h2>Physics</h2>
                <p>
                  Click to load <CaretRightOutlined />
                </p>
              </div>
              <div
                onClick={() =>
                  this.setState({ subject: "chemistry", subjectDisplay: true })
                }
              >
                <h2>Chemistry</h2>
                <p>
                  Click to load <CaretRightOutlined />
                </p>
              </div>
            </div>
            {this.state.subjectDisplay ? (
              <Get
                url={
                  "https://pokers.zeo.im/case/cases?cate=sme&sub=" +
                  this.state.subject
                }
                onSuccess={(response) =>
                  this.setState({
                    display: true,
                    subjectCount: response.data.length,
                  })
                }
                onLoading={() =>
                  this.setState({
                    display: false,
                  })
                }
              >
                {(error, response, isLoading, onReload) => {
                  if (error) {
                    openNotificationWithIcon(
                      "error",
                      "Request error, please report to TonyHe"
                    );
                    return (
                      <div className="next-cate-error">
                        <Empty description={false} />
                        <p>{error.message}</p>
                      </div>
                    );
                  } else if (isLoading) {
                    return (
                      <div>
                        <Skeleton active />
                      </div>
                    );
                  } else if (response !== null) {
                    // 请求成功展示列表
                    return (
                      <div className="next-cate-subject topic-list">
                        {response.data.map((item, index) => {
                          if (!!item.name && item.name !== "error_log") {
                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  downloadFile(item.url);
                                }}
                              >
                                <h2>{item.name.replace("amp;", "")}</h2>
                                <p>
                                  <em>{item.type}</em>Click to Download{" "}
                                  <CaretRightOutlined />
                                </p>
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  }
                  return (
                    <div>
                      <Skeleton active />
                    </div>
                  );
                }}
              </Get>
            ) : (
              ""
            )}
          </section>
        </main>
        <Footer loading={!this.state.display}></Footer>
      </div>
    );
  }
}
