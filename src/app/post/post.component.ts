import { NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    NgForOf, NgIf,
    ReactiveFormsModule  
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  http = inject(HttpClient);
  posts: any = [];
  employes: any = []; 
  uniqueCustomers: any = []; 
  orders: any = [];
  ordersDetail: any = [];
  selectedCustomer = new FormControl('');
  selectedOrder = new FormControl(''); 
  selectedCustomerDetail: any = null; 
  selectedCustomerEmploye: any = null; 
  selectedOrderDetails: any = null;

  ngOnInit(): void {
    this.fetchPosts();
    this.fetchEmploye();
    this.fetchOrderDetails();
  }

  fetchEmploye() {
    this.http.get('http://localhost:3300/employes/')
      .subscribe((employes: any) => {
        this.employes = employes;
      });
  }


  fetchPosts() {
    this.http.get('http://localhost:3300/customers/')
      .subscribe((posts: any) => {
        this.posts = posts;
        this.filterUniqueCustomers(); 
      });
  }

 

  loadOrdersForCustomer() {
    if (!this.selectedCustomer.value) {
      console.log("No se ha seleccionado ningún cliente.");
      return;
    }
    this.http.get(`http://localhost:3300/ordersCustomers/${this.selectedCustomer.value}`)
      .subscribe((orders: any) => {
        this.orders = orders;
      });
  }
  fetchOrderDetails() {
    this.http.get('http://localhost:3300/orderDetails/')
     .subscribe((ordersDetail: any) => {
        this.ordersDetail = ordersDetail;
      });
  }

  filterUniqueCustomers() {
    const customerNumbers = new Set();
    const unique: any[] = [];

    this.posts.forEach((customer: { customerNumber: unknown; }) => {
      if (!customerNumbers.has(customer.customerNumber)) {
        customerNumbers.add(customer.customerNumber);
        unique.push(customer);
      }
    });

    this.uniqueCustomers = unique;
  }

 

  loadCustomerInfo() {
    if (!this.selectedOrder.value) {
      console.log("No se ha seleccionado ninguna orden.");
      return;
    }
  
    const order = this.orders.find((o: any) => `${o.orderNumber}` === `${this.selectedOrder.value}`);
    if (!order) {
      console.log("No se encontró la orden seleccionada.");
      return;
    }
  
    this.selectedCustomerDetail = this.posts.find((c: any) =>
      `${c.orderNumber}` === `${order.orderNumber}` && `${c.customerNumber}` === `${order.customerNumber}`);
  
    if (!this.selectedCustomerDetail) {
      console.log("No se encontraron detalles del cliente para la orden seleccionada.");
      return;
    }
  
    this.selectedCustomerEmploye = this.employes.find((e: any) =>
      `${e.salesRepEmployeeNumber}` === `${this.selectedCustomerDetail.salesRepEmployeeNumber}`);
  
    if (this.selectedCustomerEmploye) {
      console.log(this.selectedCustomerEmploye);
    } else {
      console.log("No se encontraron detalles del empleado para el cliente seleccionado.");
    }

    this.selectedOrderDetails = this.ordersDetail.filter((d: any) =>
    `${d.orderNumber}` === `${this.selectedCustomerDetail.orderNumber}`);

  if (this.selectedOrderDetails.length > 0) {
    console.log(this.selectedOrderDetails);
  } else {
    console.log("No se encontraron detalles de la orden seleccionada.");
  }
  }
}