---
layout: contentwithsiblings.html
title: Technology
date: 2017-03-03
desc: Open Source Tools and Methods for Open Source Investigations
image: /assets/technology/technology.png
---

The Syrian Archive strives for transparency in its tools, findings, and methodologies, as well as in making sure that verified content is publicly available and accessible for journalists, human rights defenders, and lawyers for reporting, advocacy and accountability purposes. One of the ways this is done is through releasing all software developed publicly in free and open-source formats. This is done both to ensure trust is built and maintained between between the Syrian Archive and its partners and collaborators, as well as to allow software to be reused and customised by other groups outside of this project. Technical integration with existing open-source investigative tools ensure that work is not duplicated.

The Syrian Archive obtains and archives digital content in a variety of formats from a variety of sources and platforms. Content is stored in a centralised database and then accessed by our open-source tools to search, investigate, verify, categorise, and expand. Rather applying out-of-the-box technology solutions to the content challenges faced by the Syrian Archive, we take a user-centred approach to developing or contributing to custom open-source modular solutions (e.g. [Sugarcube](https://gitlab.com/sucarcube)), allowing our teams of investigators to collaboratively work on our data pipeline.








## Overview

![tech diagram](/assets/technology/techdiagram.jpg)

### Sources and Collection

Our database collects data from a list of sources in a variety of different source types.  We acquire data and posts daily from these sources.  Types of sources include social media channels (Twitter, Facebook, YouTube), submitted files (videos, pdf), and external and collaborator's data sets.  Changes in these sources are tracked, meaning that all versions are saved.

### Processing / Data Pipeline

Each unit of data in our database goes through our data pipeline.  In this pipeline we detect the language, standardise the data format (but keep the old format as well), as well as perform other transformations.  We screenshot and download the web page we received the information from.

### Enigio Timestamp

Files that are in our database get both their `md5` and `sha256` hash.  These get timestamped with [Enigio Time](https://www.enigio.com/) - a third party collaborator.

### Verification Tools

We use a mix of tools to verify our units.  As data is never lost, we can use a variety of tools to verify or edit new fields in the data, and then merge them back together in our centralised database.

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
