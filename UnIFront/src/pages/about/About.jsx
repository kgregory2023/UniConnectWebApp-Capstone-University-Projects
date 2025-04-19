/**
 * About page to tell people about the app while also getting familiarity with react
 * and the application it includes.
 */

import './About.css'

function About() {
    return (
        <div className="about-page">
                <h1>
                    About UNI Connect
                </h1>
                <p>
                    UnIConnect is a website that is used to foster connections and encourage engagement with the student life and campus discovery
                    being students ourselves, entering college during and after Covid-19, we understand that some might not be all that good with
                    being social and interacting with the campus life and people on campus. That's why we wanted to create a website that can help
                    those who are socially anxious or who have difficult finding locations on and off campus, as well as other students.
                    <br />
                    <br />{/* 'We could definitely make these links later on */}
                    UnIConnect has the 'Connect'  page that finds students who have similar majors, interests, or classes(?) as you to discover and maybe
                    make a friend out of.
                    <br />
                    UnIConnect has the 'Discover' page that will allow you to find notable locations on and around the campus, all rated BY students, as
                    to know exactly what the students think, and where might be a popular hang out spot. Or find out where you can find the most peace and quiet.
                </p>
                <div class="authors">
                    <h2>
                        Authors:
                    </h2>
                    <ul>
                        <li>Ian Young (Team Lead)</li>
                        <li>Sebastian Pereira (SE & Test Lead)</li>
                        <li>Matthew McClure (Code Lead)</li>
                        <li>Kieren Gregory (Security Lead)</li>
                    </ul>
                </div>
                </div>

    )
}

export default About