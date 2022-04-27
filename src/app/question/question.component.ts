import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import {interval, timeout} from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  public name:string="";
  public questionList:any=[];
  public currentQuestion:number=0;
  public points:number=0;
  counter=60;
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  progress:string="0";
  interval$:any;
  isQuizCompleted:boolean=false;
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.questionList=res.questions;
    })
  }
  nextQuestion(){
    this.currentQuestion+=1;
    this.counter=60;
  }
  previousQuestion(){
    this.currentQuestion-=1;
    this.counter=60;
  }
  answer(currentQ : number,option:any){
    if(currentQ===this.questionList.length){
      this.isQuizCompleted=true;
      this.stopCounter();
    }
    if(option.correct){
      this.points+=10;
      this.correctAnswer++;
      setTimeout(()=>{
      this.currentQuestion++;
      this.getProgessPercent();
      this.counter=60;
      },1000)
      
    }
    else{
      setTimeout(()=>{
      this.incorrectAnswer++;
      this.currentQuestion++;
      this.getProgessPercent();
      this.counter=60;
      },1000)
      this.points-=5;
      
    }

  }
  startCounter(){
    this.interval$=interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter==0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=5;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe()
    },60000)
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
   }
  getProgessPercent(){
    this.progress=((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}
