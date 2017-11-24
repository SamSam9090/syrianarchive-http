---
layout: contentwithsiblings.html
title: Technology
date: 2017-03-03
desc: Open Source Tools and Methods for Open Source Investigations
image: /assets/technology/technology.png
---

The Syrian Archive obtains and Archives data and files from a variety of sources and a variety of forms.  These are then stored in a centralized database, that our tools access to search, investigate, verify, categorize, and expand.  The technology that we develop allows teams of investigators to work together and publish subsets of data out of larger sets.  We call this the data pipeline.

To do this, the Syrian Archive contributes to open source software such as [Sugarcube](https://gitlab.com/sugarcube), as well as developing custom solutions for our verification Teams.  We release everything we create, and only use open source and free software, so it can be reused by other groups outside of this project.

## Overview

![tech diagram](/assets/technology/techdiagram.jpg)

### Sources and Collection

Our database collects data from a list of sources in a variety of different source types.  We acquire data and posts daily from these sources.  Types of sources include social media channels (twitter, facebook, youtube), sumbitted files (videos, pdf), and external and collaborator's data sets.  Changes in these sources are tracked, so we always have every version.

### Processing / Data Pipeline

Each unit of data in our database goes through our data pipeline.  In this pipeline we detect the language, standardize the data format (but keep the old format as well), as well as perform other transformations.  We screenshot and download the web page we received the information from.

### Enigio Timestamp

Files that are in our database get both their `md5` and `sha256` hash.  These get timestamped with [Enigio Time](https://www.enigio.com/) - a third party collaborator.

### Verification Tools

We use a mix of tools to verify our units.  As data is never lost, we can use a variety of tools to verify or edit new fields in the data, and then merge them back together in our centralized database.

Currently, we use a mixture of
 [Google Sheets](https://gitlab.com/sugarcube/sugarcube/tree/master/packages/plugin-googlesheets/) and [Check](https://meedan.com/en/check/)

## Stack

debian / nodejs / sugarcube / python / mongodb / nginx / react

This website is flat html files.  The database is react, calling to an api.

## Links

[Syrian Archive on Github](https://github.com/syrianarchive)

[Sugarcube - Data Pipeline](https://gitlab.com/sugarcube)

## Contact

[Contact Us](mailto:niko@syrianarchive.org) to talk about how we could help you with your archival project.
