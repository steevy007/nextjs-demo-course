import React from "react";
import Head from 'next/head'
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";


const Home = (props) => {
  return <>
    <Head>
        <title>React Meetup</title>
    </Head>
    <MeetupList meetups={props.meetups} />
  </>
};

/* export const getServerSideProps=async(context)=>{
    const req=context.req
    const res=context.res
    return{
        props:{
            meetups:DUMMY_MEETUPS
        }
    }
} */

export const getStaticProps = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://steevy:steevy@cluster0.1gcnr47.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups=await meetupsCollection.find().toArray()

  client.close()

  return {
    props: {
      meetups: meetups.map(meetup=>({
        title:meetup.title,
        image:meetup.image,
        adress:meetup.address,
        description:meetup.description,
        id:meetup._id.toString()
      }))
    },
    revalidate: 1,
  };
};

export default Home;
