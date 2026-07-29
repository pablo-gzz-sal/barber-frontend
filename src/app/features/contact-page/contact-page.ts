import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { FormsModule } from '@angular/forms';
import { ContactApiService } from '../../core/services/contact-api-service';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, Header, Footer, FormsModule],
  standalone: true,
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage implements OnInit {
  loading = false;
  sent = false;
  errorMsg = '';

  constructor(private contactApi: ContactApiService) {}

  weeklyHours = [
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Monday', hours: 'Closed' },
    { day: 'Tuesday', hours: '10 AM–4 PM' },
    { day: 'Wednesday', hours: '9 AM–9 PM' },
    { day: 'Thursday', hours: '9 AM–9 PM' },
    { day: 'Friday', hours: '9 AM–7 PM' },
    { day: 'Saturday', hours: '9 AM–5 PM' },
  ];

  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreedToTerms: false,
  };

  content = {
    hero: {
      title: 'Happy to Answer Your Questions',
      subtitle:
        'Our clients are our top priority. Call or email us with any questions about our products or services.',
    },
    form: {
      title: 'ARE YOU READY FOR A RADIANT STYLE EXPERIENCE?',
      description:
        "We'd love to hear from you. Whether you're ready to book an appointment, have a question about our services, or need personalized recommendations, we're here to help.",
      buttonText: 'Submit',
    },
    locations: {
      title: 'OUR LOCATIONS',
      featured: {
        name: 'Manhattan',
        address: {
          line1: '136 East 73rd St.',
          line2: 'New York, NY 10021',
        },
        phone: '212.628.5639',
      },
      others: [
        {
          name: 'Joseph Battisti Salon @B.U. SPACE',
          address: {
            line1: '2119 S Clinton Avenue',
            line2: 'Rochester, NY 14618',
            line3: '',
          },
          phone: '585.667.1477',
        },
        {
          name: "Joseph Battisti @COCO'S'HE",
          address: {
            line1: '500 NE Spanish Blvd',
            line2: 'Suite 103',
            line3: 'Boca Raton, FL 33431',
          },
          // Confirmed in the Option 1 design: the Boca Raton location books through the NYC number.
          phone: '212.628.5639',
        },
        {
          name: "Battisti's",
          address: {
            line1: '2575 Chili Avenue',
            line2: 'Rochester, NY 14624',
            line3: '',
          },
          phone: '585.426.3030',
        },
      ],
    },
    booking: {
      title: 'Book your appointment online!',
      // Rendered in both the mobile and desktop booking blocks — edit once, here.
      bodyBefore: 'You can ',
      linkText: 'book your appointment online',
      bodyAfter: ', or feel free to give us a call or send us an email to set it up.',
      bodySecondary:
        'For other service inquiries, press or general questions, please feel free to send us a message, or reach out via email or phone.',
    },
  };

  ngOnInit() {
    window.scroll(0, 0);
  }

  onSubmit() {
    this.errorMsg = '';
    this.sent = false;
    this.loading = true;

    // The API's ContactDto has no `subject` field and the backend runs
    // ValidationPipe({ forbidNonWhitelisted: true }), so sending one would 422 the whole
    // submission. Prepend it to the message instead so the salon still receives it.
    const subject = this.formData.subject.trim();
    const message = subject
      ? `Subject: ${subject}\n\n${this.formData.message}`
      : this.formData.message;

    const payload = {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      message,
    };

    this.contactApi.send(payload).subscribe({
      next: () => {
        this.sent = true;
        this.loading = false;
        // reset fields if you want
        // this.name = this.email = this.phone = this.message = '';
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      agreedToTerms: false,
    };
  }

  onBook() {
    if (typeof window === 'undefined') return;

    const a = document.createElement('a');
    a.href = 'https://booking.mangomint.com/307273';

    // optional: avoid navigation if their script fails to load
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
