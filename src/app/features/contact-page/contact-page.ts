import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, Header, Footer, FormsModule],
  standalone: true,
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage {

   formData = {
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreedToTerms: false
  };

  content = {
    hero: {
      title: 'Happy to Answer Your Questions',
      subtitle: 'Our clients are our top priority. Call or email us with any questions about our products or services.'
    },
    form: {
      title: 'ARE YOU READY FOR RADIANT STYLE EXPERIENCE?',
      description: 'Want love to hear from you! Whether you have questions, need support, or just want to discuss your next project, feel free to reach out.',
      buttonText: 'Submit'
    },
    locations: {
      title: 'OUR LOCATIONS',
      featured: {
        name: 'Manhattan',
        address: {
          line1: '136 East 73rd St.',
          line2: 'New York, NY 10021'
        },
        phone: '212.628.5639'
      },
      others: [
        {
          name: 'Joseph Battisti Salon 8FE U. SPACE',
          address: {
            line1: '2156 S Clinton Avenue',
            line2: 'Rochester, NY 14618'
          },
          phone: '585.697.1477'
        },
        {
          name: 'Joseph Battisti #COCOSHIRE',
          address: {
            line1: '500 NE Spanish River Blvd',
            line2: 'Boca Raton, FL 33431'
          },
          phone: '212.628.5639'
        },
        {
          name: 'Battisti\'s',
          address: {
            line1: '5825 Chevy Avenue',
            line2: 'Tampa, FL 33624'
          },
          phone: '585.426.3030'
        }
      ]
    },
    booking: {
      title: 'Book your appointment online!'
    }
  };

  onSubmit() {
    if (this.formData.agreedToTerms) {
      console.log('Form submitted:', this.formData);
      // Handle form submission logic here
      alert('Thank you for contacting us! We will get back to you soon.');
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      agreedToTerms: false
    };
  }

}
