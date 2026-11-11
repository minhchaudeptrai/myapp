import streamlit as st
st.title("Aerodynamic Forces Calculator")
col1, col2, col3 = st.columns(3)
with col1:
    g=st.number_input("Enter gravitational acceleration (often equal 9.81 meters per squared second): ", min_value=0.000, value=9.81, step=0.001, format="%.3f") 
    a=st.number_input("Enter air density (kilograms per cubic meters): ", min_value=0.000, value=1.225, step=0.001, format="%.3f")
    m=st.number_input("Enter mass (kilograms): ", min_value=0.000, step=0.001, format="%.3f")
with col2:
    p_d=st.number_input("Enter propeller diameter (meters): ", min_value=0.000, step=0.001, format="%.3f")
    w_a=st.number_input("Enter wing area (square meters): ", min_value=0.000, step=0.001, format="%.3f")
    r_s=st.number_input("Enter rotational speed (meters per second): ", min_value=0.000, step=0.001, format="%.3f")
with col3:  
    v=st.number_input("Enter velocity (meters per second): ", min_value=0.000, step=0.001, format="%.3f") 
    l_c=st.number_input("Enter drag lift coefficient: ", min_value=0.000, step=0.001, format="%.3f")
    d_c=st.number_input("Enter drag coefficient: ", min_value=0.000, step=0.001, format="%.3f")
    t_c=st.number_input("Enter thrust coefficient: ", min_value=0.000, step=0.001, format="%.3f")

l= 0.5 * a * v**2 * w_a * l_c
d= 0.5 * a * v**2 * w_a * d_c
w= m * g
t= t_c * r_s**2 * p_d**4 * a
button_1= st.button("calculate")
if button_1:
    if g==0 or a==0 or v==0 or w_a==0 or m==0 or p_d==0 or r_s==0 or l_c==0 or d_c==0 or t_c==0:
        st.write("Please enter valid values for all parameters.")
    else:
        st.write("your results are: ")
        st.write("Lift", l, "N")
        st.write("Drag", d, "N")
        st.write("Weight", w, "N")
        st.write("Thrust", t, "N")