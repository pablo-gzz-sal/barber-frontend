import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';
import { FormsModule } from '@angular/forms';
import { ContactApiService } from '../../core/services/contact-api-service';
import { ToastService } from '../../core/services/toast-service';
import { OPENING_HOURS } from '../../core/seo/seo-content';
import { IS_BROWSER } from '../../core/platform';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule, Header, Footer, FormsModule],
  standalone: true,
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage implements OnInit {
  loading = false;

  private toast = inject(ToastService);

  constructor(private contactApi: ContactApiService) {}

  /**
   * Derived from OPENING_HOURS rather than restated, so the hours a visitor reads and the
   * hours in LocalBusiness schema can never disagree (Steph §7).
   */
  weeklyHours = OPENING_HOURS.map((h) => ({
    day: h.day,
    hours: h.opens && h.closes ? `${this.to12h(h.opens)}–${this.to12h(h.closes)}` : 'Closed',
  }));

  /** '10:00' -> '10 AM', '16:00' -> '4 PM', '09:30' -> '9:30 AM'. */
  private to12h(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
  }

  /**
   * Google Maps link for a location's address block. Uses the documented Maps URL scheme, so
   * it hands off to the native Maps app on iOS/Android and opens maps.google.com on desktop.
   * Built from the address lines only — the salon names contain '@' and punctuation that make
   * the search less reliable than a plain street address.
   */
  mapsUrl(address: { line1: string; line2: string; line3?: string }): string {
    const query = [address.line1, address.line2, address.line3]
      .filter((line) => !!line?.trim())
      .join(', ');

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '', // honeypot
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
    if (IS_BROWSER) window.scroll(0, 0);
  }

  onSubmit() {
    // Angular's NgForm puts `novalidate` on the <form>, so the template's
    // `required` attributes never fire — without this guard an empty form
    // reaches the API and comes back 422.
    if (this.loading || !this.validate()) return;

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
      // Honeypot: only sent when filled (i.e. by a bot), so real visitors' payloads
      // stay exactly what the API has always accepted.
      ...(this.formData.website ? { website: this.formData.website } : {}),
    };

    this.contactApi.send(payload).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Message sent', 'Check your inbox for a confirmation email.');
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 429) {
          this.toast.error(
            'Too many messages',
            'Please wait a few minutes before trying again, or give us a call.',
          );
          return;
        }
        // The API returns an array of strings for 422 validation errors.
        const detail = err?.error?.message;
        this.toast.error(
          'Message not sent',
          Array.isArray(detail) ? detail[0] : detail || 'Please try again, or give us a call.',
        );
      },
    });
  }

  /** Mirrors the backend's ContactDto rules so the visitor is told what is missing. */
  private validate(): boolean {
    const { name, email, message, agreedToTerms } = this.formData;

    if (name.trim().length < 2) {
      this.toast.error('Please enter your name');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      this.toast.error('Please enter a valid email address');
      return false;
    }

    if (message.trim().length < 5) {
      this.toast.error('Please enter a message');
      return false;
    }

    if (!agreedToTerms) {
      this.toast.error('Please accept the Privacy Policy and Terms & Conditions');
      return false;
    }

    return true;
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      website: '',
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
