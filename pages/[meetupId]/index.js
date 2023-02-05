import React from "react";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetailInfo from "../../components/meetups/MeetupDetail";
const MeetupDetail = (props) => {
  const meetup = props.meetup;
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <MeetupDetailInfo
        image={meetup.image}
        title={meetup.title}
        adress={meetup.adress}
        description={meetup.description}
      />
    </>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://steevy:steevy@cluster0.1gcnr47.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  //const meetupId = context.params.meetupId;

  //console.log(meetupId);

  client.close();
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://steevy:steevy@cluster0.1gcnr47.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  console.log(selectedMeetup);

  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        adress: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetail;
