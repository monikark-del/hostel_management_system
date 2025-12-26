"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-primary border-t border-primary-foreground/10 mt-20">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl text-secondary mb-4">
              HostelHub
            </h3>
            <p className="font-paragraph text-base text-primary-foreground/80">
              Modern hostel management solution for educational institutions.
              Streamline operations and enhance student living experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-secondary mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="font-paragraph text-base text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/students"
                  className="font-paragraph text-base text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  href="/rooms"
                  className="font-paragraph text-base text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/allocations"
                  className="font-paragraph text-base text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Room Allocations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg text-secondary mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="font-paragraph text-base text-primary-foreground/80">
                  info@hostelhub.edu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="font-paragraph text-base text-primary-foreground/80">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="font-paragraph text-base text-primary-foreground/80">
                  Campus Housing Office, Building A
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="font-paragraph text-sm text-primary-foreground/60 text-center">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
