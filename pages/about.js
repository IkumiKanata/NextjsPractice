import Head from "next/head";
import axios from "axios";
import React, { Component } from "react";
import { CreateSubtitleForYoutube, BESTAPI_TED } from "../constants/URLs";
import CardList from "../components/VideoCardList";
import DictionaryCard from "../components/dictionaryCard";
import Navbar from "../components/Navbar/Navbar";

export default class App extends Component {
  state = {
    inputWord: "",
    videoTitles: [],
    videoIDs: [], //holds youtubeID from tedAPI to use them in subtitleAPI and thumbnail
    subtitFleDatas: null, //place subtitles for 3 videos
    targetSubtitleLines: [], //
    dictionaryData: [],
    selectshow: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() });
  };

  getVideoIds = async (inputWord) => {
    const params = {
      params: {
        size: 5,
        text: inputWord,
        "rapidapi-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    };
    const res = await axios.get(BESTAPI_TED, params);
    const videoIDList = res.data.map((element) => element.youTubeID);
    this.setState({
      videoIDs: videoIDList,
    });
    const videoTitleList = res.data.map((element) => element.name);
    this.setState({
      videoTitles: videoTitleList,
    });
    console.log(videoIDList[1]); //stateにアクセスして値を取得できているので、上のsetstateは完了している
    return  videoIDList;
  }

  getSubTitleDataList = async (videoIDList) => {
    const resultList = await Promise.all(
      //promise.all promise aynsc await 非道j機処理-jsの処理を待たせる　promiseもwawaitみたいに待つよってやつで、allオプションは　　promiseの戻り値が配列としてリターンされるときに、使うことができる
      videoIDList.map(
        async (
          videoID //mapのなかasync await を使う
        ) => {
          const url = CreateSubtitleForYoutube(videoID);
          const response = await axios.get(url);
          return response;
        }
      )
    );
    const subtitleDataList = resultList.map((videodata) => videodata.data);
    this.setState({
      subtitleDatas: subtitleDataList,
    });
    return subtitleDataList;
  }

  getDictionaryData = async (inputWord) => {
    try {
// テストする文
    // monthName=getMonthName(myMonth) // 関数は例外を投げることがある
    const res = await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en_US/" + inputWord); 
    console.log(res.data[0])
    this.setState({
      dictionaryData: res.data
    })
}
catch (e) {
    // monthName="unknown"
    console.log("error") // 例外オブジェクトをエラー処理部分に渡す
    this.setState({
      dictionaryData: null
    })
}
  }

  fetchAPI = async (e) => {
    const { inputWord } = this.state;
    e.preventDefault();
    const videoIDList = await this.getVideoIds(inputWord);
    const dictionaryData = await this.getDictionaryData(inputWord);
    const subtitleDataList = await this.getSubTitleDataList(videoIDList);
    let subtitleWord = [];
    for (let i = 0; i < subtitleDataList.length; i++) {
      subtitleWord.push(
        subtitleDataList[i].filter((element) => {
          return element.text.toLowerCase().includes(inputWord) === true;
        })
      );
    }
    this.setState({ targetSubtitleLines: subtitleWord });
    this.setState({ selectshow: true });
  };

  render() {
    const {
      selectshow,
      videoIDs,
      videoTitles,
      targetSubtitleLines,
      inputWord,
      dictionaryData,

    } = this.state;
    return (
      <>
        <form onSubmit={this.fetchAPI}>
          {/* //refer your function using `this`. Need page transtion here as well */}
          <input
            type="text"
            placeholder="happiness, in order to, put aside..."
            name="inputWord"
            value={inputWord}
            onChange={this.handleChange}
          ></input>
          <input type="submit" placeholder="GO" value="GO"></input>
        </form>

        <div
          // style={{
          //   width: "80%",
          //   margin: "0 auto",

            // // padding: 2.5 % 0,
            // // display: "flex",
            // // flexFlow: "row wrap",
            // justifyContent: "space-evenly",
          // }}
        > 
        <DictionaryCard 
        // style={{marginBottom: "15px"}}
        dictionaryData={dictionaryData}
        selectshow={selectshow}
        inputWord={inputWord}
         />
        </div>
        <br />

 
        <div
          // style={{
          //   padding: 2.5 % 0,
          //   display: "flex",
          //   flexFlow: "row wrap",
          //   justifyContent: "space-evenly",
          // }}
        >
          <CardList
            selectshow={selectshow}
            videoIDs={videoIDs}
            videoTitles={videoTitles}
            targetSubtitleLines={targetSubtitleLines}
            inputWord={inputWord}
          />
        </div>
      </>
    );
  }
}