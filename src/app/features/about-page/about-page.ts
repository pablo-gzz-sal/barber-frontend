import { Component } from '@angular/core';
import { UI_TEXT } from '../../core/constants/app-text';
import { CommonModule } from '@angular/common';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-about-page',
  imports: [CommonModule, Header, Footer],
  standalone: true,
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {
    // protected readonly content = UI_TEXT.ABOUT;
    content = {
    hero: {
      title: 'Our Story',
      subtitle: 'Where Precision Meets Flow'
    },
    kinetics: {
      title: 'Hair Kinetics™ by Joseph Battisti',
      description1: 'Hair Kinetics™ is a cutting and styling methodology developed by Joseph Battisti that focuses on the natural movement and structure of hair. The technique is based on cutting the hair where it naturally falls, rather than forcing direction or shape. This approach allows the hair to grow out evenly, maintain balance, and move with ease, reducing the need for constant maintenance.',
      description2: 'Unlike traditional methods that rely on matching hairstyles to standard face shapes, Hair Kinetics™ customizes every cut to the client\'s unique bone structure and hair behavior. By integrating precision cutting with modern deconstruction techniques, the result is a style that looks intentional, structured, and naturally dynamic.',
      commitment: {
        title: 'OUR COMMITMENT',
        description: 'At Hair Kinetics™, every service is guided by a single goal: to deliver precision-based, natural-looking results that evolve seamlessly with each client\'s lifestyle. Each cut, treatment, and style is approached as a layered design, technically sound, sustainable, and personalized to the individual.'
      }
    },
    artist: {
      name: 'Joseph Battisti',
      bio1: 'With over 25 years of experience, Joseph has built his career on precision, innovation, and authenticity in hairstyling. Trained in Milan, Italy, he developed a strong foundation in technical cutting and design before establishing his practice in New York City.',
      bio2: 'As a former Creative Director in luxury salons, his focus has always been on creating natural movement and structure in every cut. His work has been featured in Vogue, Harper\'s Bazaar, Marie Claire, InStyle, W Magazine, and Allure, which named him among New York\'s Top Stylists.',
      bio3: 'He also develops advanced hair systems, including human-hair keratin treatments and extensions such as Miniveils and Hairbit, enhancing strength, texture, and flexibility while preserving the hair\'s natural integrity. His goal is to create hair that moves effortlessly and grows beautifully with each client.',
      tvFeature: {
        title: 'TV Feature',
        description: 'Joseph\'s expertise was showcased on national television, bringing his signature precision and artistry to the FX series. His work continues to be recognized across both the beauty and entertainment industries.'
      }
    },
    team: {
      title: 'MEET THE TEAM',
      members: [
        {
          name: 'Megan Richardson',
          image: 'assets/images/team-megan.jpg',
          bio: 'Senior stylist specializing in precision cuts and color correction with 10+ years of experience.'
        },
        {
          name: 'Nicole Chan',
          image: 'assets/images/team-nicole.jpg',
          bio: 'Nicole was born and raised in Los Angeles and has trained at a string of prestigious salons including Toni and Guy, Vidal Sassoon, Sebastian, Bumble and Bumble, Frederic Fekkai, and Paul LaBrecque Salon. True to her West Coast roots, Nicole has a flair for creating authentic bohemian looks and flirtatious beach waves with natural-looking, sun-kissed blonde highlights. Expertly skilled at balayage, razor cuts, and working with naturally curly and wavy hair, Nicole produces looks that are low maintenance and naturally sexy. She is personable and approachable and has an intuitive sense of style that ensures your new look will perfectly suit you.'
        },
        {
          name: 'June Lastname',
          image: 'assets/images/team-june.jpg',
          bio: 'Master colorist with expertise in balayage and dimensional color techniques.'
        }
      ]
    },
    contact: {
      hoursTitle: 'Our Hours',
      hours: [
        { day: 'Tuesday', time: '10am-4pm' },
        { day: 'Wed-Thu', time: '9am-9pm' },
        { day: 'Friday', time: '9pm-7pm' },
        { day: 'Saturday', time: '9am-5pm' },
        { day: 'Sunday', time: 'Closed' },
        { day: 'Monday', time: 'Closed' }
      ],
      emailTitle: 'Email us',
      email: 'info@JosephBattisti.com',
      callTitle: 'Call Us',
      phone: '212.628.5639',
      locationTitle: 'Location',
      address: {
        line1: '136 East 73rd St.',
        line2: 'New York, NY 10021'
      }
    }
  };

}
