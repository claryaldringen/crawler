# crawler
 Demo crawler for IP Fabric


TEST:

**Part 1:** Write a program that crawls webpages in NodeJS.



A crawler at its core downloads URLs, discovers new URLs in the downloaded

content, and schedules download of new discovered URLs.

Example:

* Fetch the content of a discovered URL

* Discover any new URLs by extracting them from the fetched content

* Crawl any new URLs

* Seed the crawler with https://ipfabric.io/ as the start URL (first

  discovered URL)



**Part 2:** State your assumptions and limitations of your solution. Evaluate
the weaknesses of this solution. Suggestions for future improvements of
your crawler is a plus. In particular how it might be scaled to run on a
large grid of machines.  (Maximum 1 page!)

SOLUTION:

The program runs in multiple threads. The main thread serves as a shared memory where URLs to be processed and also URLs already processed are stored. Threads processing URLs access the main thread via the HTTP protocol and sequentially fetch URLs to process and add URLs that have been parsed from visited websites.

IMPROVEMENTS:

Instead of the main thread as shared memory, use a database that has better resolved concurrency accesses. At the same time, the database entries can contain a flag by which they will be distributed among the machines. 

