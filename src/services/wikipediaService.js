// src/services/wikipediaService.js

// Utility: get past date in YYYYMMDD format
const getPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
};

export const fetchWikiData = async (title) => {
  try {
    const WIKI_API_ENDPOINT =
      "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query";
    const WIKI_PAGEVIEWS_ENDPOINT =
      "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user";

    // --- STEP 0: Normalize title via search (case-insensitive & minor spelling variations) ---
    const searchUrl = `${WIKI_API_ENDPOINT}&list=search&srsearch=${encodeURIComponent(
      title
    )}&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error("Search request failed.");
    const searchData = await searchRes.json();
    if (!searchData?.query?.search?.length) {
      throw new Error(`Page "${title}" not found via search.`);
    }

    const correctTitle = searchData.query.search[0].title;
    const encodedCorrectTitle = encodeURIComponent(correctTitle);

    // --- STEP 1: Build all requests ---
    const coreInfoUrl = `${WIKI_API_ENDPOINT}&prop=info|extracts|pageimages&inprop=url|protection&explaintext&pithumbsize=300&titles=${encodedCorrectTitle}`;
    const linksUrl = `${WIKI_API_ENDPOINT}&prop=links&pllimit=max&titles=${encodedCorrectTitle}`;
    const backlinksUrl = `${WIKI_API_ENDPOINT}&prop=linkshere&lhlimit=max&titles=${encodedCorrectTitle}`;
    const revisionsUrl = `${WIKI_API_ENDPOINT}&prop=revisions&rvprop=timestamp|user|ids&rvlimit=100&rvdir=newer&titles=${encodedCorrectTitle}`;
    const languagesUrl = `${WIKI_API_ENDPOINT}&prop=langlinks&lllimit=max&titles=${encodedCorrectTitle}`;
    const pageviewsUrl = `${WIKI_PAGEVIEWS_ENDPOINT}/${encodedCorrectTitle}/daily/${getPastDate(
      31
    )}/${getPastDate(2)}`;

    const responses = await Promise.allSettled([
      fetch(coreInfoUrl),
      fetch(linksUrl),
      fetch(backlinksUrl),
      fetch(revisionsUrl),
      fetch(languagesUrl),
      fetch(pageviewsUrl),
    ]);

    // --- STEP 2: Parse responses safely ---
    const parseJsonSafe = async (res) => {
      try {
        return res?.value?.ok ? await res.value.json() : {};
      } catch {
        return {};
      }
    };

    const [
      coreRes,
      linksRes,
      backlinksRes,
      revisionsRes,
      languagesRes,
      pageviewsRes,
    ] = responses;

    const coreData = await parseJsonSafe(coreRes);
    const linksData = await parseJsonSafe(linksRes);
    const backlinksData = await parseJsonSafe(backlinksRes);
    const revisionsData = await parseJsonSafe(revisionsRes);
    const languagesData = await parseJsonSafe(languagesRes);
    const pageviewsData = await parseJsonSafe(pageviewsRes);

    // --- STEP 3: Process data ---
    const pageId = Object.keys(coreData?.query?.pages || {})[0];
    const page = coreData?.query?.pages?.[pageId];
    if (!page) throw new Error("Page data not found.");

    const allRevisions = revisionsData?.query?.pages?.[pageId]?.revisions || [];
    const firstRevision =
      allRevisions.length > 0 ? allRevisions[0] : { timestamp: null, user: "" };
    const lastRevision =
      allRevisions.length > 0
        ? allRevisions[allRevisions.length - 1]
        : { user: "" };

    const pageviewsItems = pageviewsData?.items || [];
    const totalViews = pageviewsItems.reduce(
      (sum, item) => sum + (item.views || 0),
      0
    );
    const averageDailyViews =
      pageviewsItems.length > 0
        ? Math.round(totalViews / pageviewsItems.length)
        : 0;

    // --- STEP 4: Combine data ---
    const combinedData = {
      title: page.title,
      pageId: page.pageid,
      length: page.length,
      summary: page.extract, // full article text
      lastEdit: page.touched ? new Date(page.touched).toLocaleString() : null,
      imageUrl: page.thumbnail ? page.thumbnail.source : null,
      links: linksData?.query?.pages?.[pageId]?.links || [],
      backlinks: backlinksData?.query?.pages?.[pageId]?.linkshere || [],
      creationDate: firstRevision.timestamp
        ? new Date(firstRevision.timestamp).toLocaleString()
        : null,
      lastEditor: lastRevision.user || null,
      uniqueEditors:
        allRevisions.length > 0
          ? [...new Set(allRevisions.map((rev) => rev.user))].length
          : 0,
      languages: languagesData?.query?.pages?.[pageId]?.langlinks?.length || 0,
      pageviewsData: pageviewsItems,
      totalViews: totalViews,
      averageDailyViews: averageDailyViews,
    };

    return combinedData;
  } catch (err) {
    throw err;
  }
};
