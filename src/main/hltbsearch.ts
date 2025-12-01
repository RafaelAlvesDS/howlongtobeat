
const axios: any = require('axios');
const UserAgent: any = require('user-agents');
const cheerio: any = require('cheerio')


/**
 * Takes care about the http connection and response handling
 */
export class HltbSearch {
  public static BASE_URL: string = "https://howlongtobeat.com/";
  public static DETAIL_URL: string = `${HltbSearch.BASE_URL}game?id=`;
  public static SEARCH_URL: string = `${HltbSearch.BASE_URL}api/search`;
  public static IMAGE_URL: string = `${HltbSearch.BASE_URL}games/`;

  private searchKey: string;

  payload: any = {
    "searchType": "games",
    "searchTerms": [""],
    "searchPage": 1,
    "size": 20,
    "searchOptions": {
      "games": {
        "userId": 0,
        "platform": "",
        "sortCategory": "popular",
        "rangeCategory": "main",
        "rangeTime": {
          "min": null,
          "max": null
        },
        "gameplay": {
          "perspective": "",
          "flow": "",
          "genre": "",
          "difficulty": ""
        },
        "rangeYear": {
          "min": "",
          "max": ""
        },
        modifier: "",
      },
      users: {
        sortCategory: "postcount",
      },
      "lists": {
        "sortCategory": "follows"
      },
      "filter": "",
      "sort": 0,
      "randomizer": 0,
      "useCache": true
    }
  }

  async detailHtml(gameId: string, signal?: AbortSignal): Promise<string> {
    try {
      let result = await axios
        .get(`${HltbSearch.DETAIL_URL}${gameId}`, {
          headers: {
            "User-Agent": new UserAgent().toString(),
            origin: "https://howlongtobeat.com",
            referer: "https://howlongtobeat.com",
          },
          timeout: 20000,
          signal,
        })
        .catch((e) => {
          throw e;
        });
      return result.data;
    } catch (error) {
      if (error) {
        throw new Error(error);
      } else if (error.response.status !== 200) {
        throw new Error(`Got non-200 status code from howlongtobeat.com [${
          error.response.status
        }]
          ${JSON.stringify(error.response)}
        `);
      }
    }
  }

  async search(query: Array<string>, signal?: AbortSignal): Promise<any> {
    // Use built-in javascript URLSearchParams as a drop-in replacement to create axios.post required data param
    let search = { ...this.payload };
    search.searchTerms = query;
    try {
      if (!this.searchKey) {
        this.searchKey = await this.getSearchKey();
      }

      let result = await axios.post(HltbSearch.SEARCH_URL, search, {
        headers: {
          "User-Agent": new UserAgent().toString(),
          'Accept': '*/*',
          "Content-Type": "application/json",
          "Origin": "https://howlongtobeat.com",
          "Referer": `https://howlongtobeat.com/`,
          "x-auth-token": this.searchKey,
        },
        timeout: 20000,
        signal,
      });
      return result.data;
    } catch (error) {
      if (error) {
        throw new Error(error);
      } else if (error.response.status !== 200) {
        throw new Error(`Got non-200 status code from howlongtobeat.com [${error.response.status
          }]
              ${JSON.stringify(error.response)}
            `);
      }
    }
  }

  private async getSearchKey(): Promise<string> {
    const url = `${HltbSearch.SEARCH_URL}/init?t=${Date.now()}`;
    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": new UserAgent().toString(),
          origin: "https://howlongtobeat.com",
          referer: "https://howlongtobeat.com",
        },
      });
      return res.data.token;
    } catch (error) {
      throw new Error("Could not find search key");
    }
  }
}
